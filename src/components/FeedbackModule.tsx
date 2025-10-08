// src/components/FeedbackModule.tsx
import React, { useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Star, Image as ImageIcon, Trash2 } from 'lucide-react';

const FeedbackModule = () => {
  const { feedbacks, books, currentUser, addFeedback, deleteFeedback } = useLibraryStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    comment: '',
    rating: 5,
    imageUrl: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please login to submit feedback' });
      return;
    }

    if (!formData.title || !formData.comment) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const selectedBook = books.find(b => b.id === formData.bookId);

    addFeedback({
      userId: currentUser.id,
      userName: currentUser.userFullName,
      bookId: formData.bookId || undefined,
      bookTitle: selectedBook?.title,
      title: formData.title,
      comment: formData.comment,
      rating: formData.rating,
      imageUrl: formData.imageUrl || undefined,
    });

    setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
    setFormData({ bookId: '', title: '', comment: '', rating: 5, imageUrl: '' });
    setIsOpen(false);
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedback(id);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Feedback & Reviews
        </h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Your Feedback</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Book Selection (Optional) */}
              <div className="space-y-2">
                <Label>Related Book (Optional)</Label>
                <Select value={formData.bookId} onValueChange={(val) => setFormData({ ...formData, bookId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a book (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None - General Feedback</SelectItem>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title} - {book.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief title for your feedback"
                  required
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Rating *</Label>
                {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your thoughts and experiences..."
                  rows={5}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No feedback yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          feedbacks.map((feedback) => (
            <Card key={feedback.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {feedback.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feedback.imageUrl}
                    alt={feedback.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  {feedback.bookTitle && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-sm font-medium">{feedback.bookTitle}</p>
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{feedback.title}</CardTitle>
                    {feedback.bookTitle && !feedback.imageUrl && (
                      <p className="text-sm text-muted-foreground mt-1">
                        About: {feedback.bookTitle}
                      </p>
                    )}
                  </div>
                  {currentUser?.isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(feedback.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {renderStars(feedback.rating)}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {feedback.comment}
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t text-xs text-muted-foreground">
                  <span className="font-medium">{feedback.userName}</span>
                  <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackModule;