import { stats, Stat } from '@/data/statsData'; 
import { Separator } from '@/components/ui/separator'; // Assuming you have a Shadcn Separator component

export const Stats = () => {

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
      
      {/* Title */}
      <h2 className='text-3xl font-bold tracking-tight text-gray-900 text-center mb-8'>
        Library Statistics
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: Stat) => {
          const IconComponent = stat.icon; // Assign the icon component dynamically
          return (
            <div 
              key={stat.id} 
              className="rounded-xl border bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                {/* Icon Circle */}
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <IconComponent iconNode={[]} className="h-8 w-8" />
                </div>
                
                {/* Text Content */}
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-4xl font-extrabold text-gray-900 mt-1">
                    {stat.count.toLocaleString()} {/* Format numbers with commas */}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Separator for visual hierarchy */}
      <Separator className="mt-12" />
    </div>
  );
};