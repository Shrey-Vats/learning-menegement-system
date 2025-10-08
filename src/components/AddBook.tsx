// src/components/AddBook.tsx
import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Plus } from 'lucide-react';

const AddBook = () => {
  const { addBook } = useLibraryStore();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    coverUrl: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.category || !formData.price) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid price' });
      return;
    }

    addBook({
      title: formData.title,
      author: formData.author,
      category: formData.category,
      price: price,
      coverUrl: formData.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover',
      totalCopies: 3, // Fixed: 3 copies per category
    });

    setMessage({ type: 'success', text: 'Book added successfully! (3 copies added)' });
    setFormData({ title: '', author: '', category: '', price: '', coverUrl: '' });
    
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Add New Book
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Book Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Fiction, Science, Biography"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter book price"
              required
            />
            <p className="text-xs text-muted-foreground">
              Used for calculating fines (200% for missing, 10% for small damage, 50% for large damage)
            </p>
          </div>

          {/* Cover URL */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
            <Input
              id="coverUrl"
              type="url"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
            {formData.coverUrl && (
              <div className="mt-2 border rounded-lg overflow-hidden w-32">
                <img
                  src={formData.coverUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">System Rules:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 3 copies will be automatically added for each book</li>
              <li>• Each person/group can borrow only 1 book at a time</li>
              <li>• Individual borrowing: 30 days limit</li>
              <li>• Group borrowing (3-6 members): 180 days limit</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Book (3 Copies)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBook;