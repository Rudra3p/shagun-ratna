"use client";
import { MessageSquare, Users, TrendingUp, Package, Shield, Verified, Trash2, User } from 'lucide-react';

const historyData = [
  {
    group: 'Today',
    items: [
      { id: 1, title: "Updated 'Royal Sapphire Halo' stock", desc: "Adjusted inventory levels for the Autumn Collection peak demand.", time: "2h ago", author: "Admin Executive", icon: Package },
      { id: 2, title: "Modified User Permissions", desc: "Elevated 'Sarah Chen' to Moderator status for the Inquiries department.", time: "5h ago", author: "Security Lead", icon: Shield },
    ]
  },
  {
    group: 'Yesterday',
    items: [
      { id: 3, title: "Approved Review #4829", desc: "Validated a 5-star customer testimonial for the 'Midnight Crimson Necklace'.", time: "1d ago", author: "Content Mod", icon: Verified },
    ]
  },
  {
    group: 'Last Week',
    items: [
      { id: 4, title: "Deleted Outdated Product Batch", desc: "Removed 15 inactive SKUs from the 'Summer Solstice' legacy collection.", time: "Oct 24", author: "Admin Executive", icon: Trash2 },
    ]
  }
];

export default function HistoryPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <FilterButton icon={MessageSquare} label="Reviews" />
        <FilterButton icon={Users} label="Visitors" />
        <FilterButton icon={TrendingUp} label="Popular Products" />
        
        <div className="flex bg-surface-container-high p-1 rounded-lg ml-auto">
          <button className="px-4 py-1.5 rounded-md bg-surface-container-lowest text-primary font-label text-xs shadow-sm transition-all font-bold">Daily</button>
          <button className="px-4 py-1.5 rounded-md text-secondary font-label text-xs hover:bg-surface-variant/50 transition-all font-bold">Weekly</button>
        </div>
      </div>

      <div className="space-y-10">
        {historyData.map((group) => (
          <div key={group.group} className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{group.group}</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex gap-6 items-start hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-on-surface truncate pr-4">{item.title}</h3>
                      <span className="text-xs text-secondary font-label shrink-0">{item.time}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{item.desc}</p>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-secondary" />
                      <span className="text-xs font-semibold text-secondary">{item.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-variant transition-all text-on-surface-variant group">
      <Icon size={18} className="text-secondary group-hover:text-primary transition-colors" />
      <span className="font-label text-xs font-bold">{label}</span>
    </button>
  );
}