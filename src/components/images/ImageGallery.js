"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ImageModal from './ImageModal';

const ImageGallery = ({ images, loading, hasMore, loadMore }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
  };
  
  // Animation variants for the image cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {images.map((image) => (
          <motion.div 
            key={image.id} 
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-900"
            variants={itemVariants}
            onClick={() => handleImageClick(image)}
          >
            <div className="relative" style={{ paddingBottom: '75%' }}>
              <Image
                src={image.preview_url || image.sample_url}
                alt={image.tags}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="text-xs truncate max-w-[80%]">
                  {image.tags.split(' ').slice(0, 3).join(', ')}
                </div>
                <div className="text-xs bg-red-600 px-2 py-1 rounded">
                  {image.width}x{image.height}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {loading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden">
              <div className="bg-gray-900 animate-pulse relative" style={{ paddingBottom: '75%' }}></div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-lg">No images found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
      
      {!loading && hasMore && images.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={loadMore}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
      
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default ImageGallery;
