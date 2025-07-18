import { useEffect, useState, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from './ui/carousel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import brandLabelsImage from 'figma:asset/328ba20a323da6282888cfb8765b461fc58d99f3.png';
import burgundyDressImage from 'figma:asset/9d6122b86edc01703cf0c741f59b44358830b785.png';
import naturalCollectionImage from 'figma:asset/71a3f0147b5abd54c904d2db01d8a062d9561ed0.png';
import designProcessImage from 'figma:asset/e5d98b0b26b8b0bb80bf20a839ddd47e7fbae87f.png';
import fabricDetailImage from 'figma:asset/61f547961a82728fcc6f437ea960d239ced2242f.png';
import lifestyleImage from 'figma:asset/ae6b43ce4ada11645bfe58a2d1a994ebe2f8e931.png';

export function PhotoCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);

  const photos = [
    {
      id: 1,
      url: brandLabelsImage,
      description: {
        line1: "Signature",
        line2: "Craftsmanship"
      },
      isImported: true,
      preserveAspectRatio: true
    },
    {
      id: 2,
      url: burgundyDressImage,
      description: {
        line1: "Contemporary",
        line2: "Style"
      },
      isImported: true,
      preserveAspectRatio: true
    },
    {
      id: 3,
      url: naturalCollectionImage,
      description: {
        line1: "Nature-inspired",
        line2: "Design"
      },
      isImported: true,
      preserveAspectRatio: true
    },
    {
      id: 4,
      url: designProcessImage,
      description: {
        line1: "Artistic",
        line2: "Design"
      },
      isImported: true,
      preserveAspectRatio: true
    },
    {
      id: 5,
      url: fabricDetailImage,
      description: {
        line1: "Luxurious",
        line2: "Textures"
      },
      isImported: true,
      preserveAspectRatio: true
    },
    {
      id: 6,
      url: lifestyleImage,
      description: {
        line1: "Confident",
        line2: "Style"
      },
      isImported: true,
      preserveAspectRatio: true
    }
  ];

  // Auto-scroll functionality
  const scrollNext = useCallback(() => {
    if (api && !isPaused) {
      api.scrollNext();
    }
  }, [api, isPaused]);

  useEffect(() => {
    if (!api) return;

    // Set up auto-scroll interval
    const intervalId = setInterval(scrollNext, 3000); // Auto-scroll every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [scrollNext]);

  // Handle mouse enter/leave for pause/resume functionality
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section className="h-80 px-4 flex items-center">
      <Carousel 
        className="w-full max-w-7xl mx-auto"
        opts={{
          loop: true,
          align: "start"
        }}
        setApi={setApi}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent className="-ml-4">
          {photos.map((photo) => (
            <CarouselItem key={photo.id} className="pl-4 basis-auto">
              <div className="relative h-80 overflow-hidden rounded-lg">
                {photo.isImported ? (
                  <img
                    src={photo.url}
                    alt={`${photo.description.line1} ${photo.description.line2}`}
                    className={`h-full transition-transform duration-300 hover:scale-105 ${
                      photo.preserveAspectRatio ? 'w-auto object-contain' : 'w-full object-cover'
                    }`}
                    style={photo.preserveAspectRatio ? { minWidth: '200px' } : { width: '320px' }}
                  />
                ) : (
                  <ImageWithFallback
                    src={photo.url}
                    alt={`${photo.description.line1} ${photo.description.line2}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg leading-tight">{photo.description.line1}</p>
                  <p className="text-lg leading-tight">{photo.description.line2}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}