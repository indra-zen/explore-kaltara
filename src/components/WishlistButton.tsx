'use client';

import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({ item, className = '', showText = false }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(item.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        ${inWishlist 
          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:text-red-500'
        }
        ${className}
      `}
      title={inWishlist ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
    >
      <Heart 
        className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {inWishlist ? 'Tersimpan' : 'Simpan'}
        </span>
      )}
    </button>
  );
}
