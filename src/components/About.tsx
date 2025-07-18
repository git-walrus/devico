import { ArrowLeft, Leaf, Heart, Users, Award, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent } from './ui/card';
import { Footer } from './Footer';
import { useState, useEffect, useRef } from 'react';

interface AboutProps {
  onNavigateHome: () => void;
}

export function About({ onNavigateHome }: AboutProps) {
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hero banner video carousel state
  const [currentHeroVideoIndex, setCurrentHeroVideoIndex] = useState(0);
  const heroVideoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hero banner video carousel data
  const heroVideos = [
    'https://res.cloudinary.com/djh25rpnm/video/upload/v1752236583/Banner_Train_FHD_xcrzan.mp4',
    'https://res.cloudinary.com/djh25rpnm/video/upload/v1752239846/Banner_SlowWalk_4K_qqmhzm.mp4',
    'https://res.cloudinary.com/djh25rpnm/video/upload/v1752240055/Banner_LeafGirl_4K_dyg1a3.mp4'
  ];

  const timelineData = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'DevīCo was born from a vision to create sustainable, ethically-made fashion that empowers women while respecting our planet.',
      videoUrl: 'https://videos.pexels.com/video-files/7564059/7564059-hd_1080_1920_30fps.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    },
    {
      year: '2024',
      title: 'First Collection Launch',
      description: 'Our debut collection featured 12 versatile pieces made from organic cotton and recycled materials, setting the foundation for our sustainable approach.',
      videoUrl: 'https://videos.pexels.com/video-files/8844337/8844337-uhd_1440_2560_30fps.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'We expanded internationally, bringing our sustainable fashion philosophy to customers across 15 countries while maintaining our commitment to ethical manufacturing.',
      videoUrl: 'https://videos.pexels.com/video-files/5138030/5138030-uhd_1440_2732_25fps.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop'
    },
    {
      year: '2026',
      title: 'Carbon Neutral Achievement',
      description: 'Achieved carbon neutrality across our entire supply chain, from raw materials to customer delivery, setting a new standard for sustainable fashion.',
      videoUrl: 'https://videos.pexels.com/video-files/11208882/11208882-hd_2560_1440_30fps.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=600&h=400&fit=crop'
    }
  ];

  const startProgress = () => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / 40); // 4 seconds = 4000ms, update every 100ms
      });
    }, 100);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startTimeline = () => {
    timelineIntervalRef.current = setInterval(() => {
      setCurrentTimelineIndex(prev => (prev + 1) % timelineData.length);
    }, 4000);
  };

  const stopTimeline = () => {
    if (timelineIntervalRef.current) {
      clearInterval(timelineIntervalRef.current);
      timelineIntervalRef.current = null;
    }
  };

  const startHeroVideoCarousel = () => {
    heroVideoIntervalRef.current = setInterval(() => {
      setCurrentHeroVideoIndex(prev => (prev + 1) % heroVideos.length);
    }, 8000); // Change video every 8 seconds
  };

  const stopHeroVideoCarousel = () => {
    if (heroVideoIntervalRef.current) {
      clearInterval(heroVideoIntervalRef.current);
      heroVideoIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isTimelinePlaying) {
      startProgress();
      startTimeline();
    } else {
      stopProgress();
      stopTimeline();
    }

    return () => {
      stopProgress();
      stopTimeline();
    };
  }, [isTimelinePlaying]);

  // Hero video carousel effect
  useEffect(() => {
    startHeroVideoCarousel();

    return () => {
      stopHeroVideoCarousel();
    };
  }, []);

  useEffect(() => {
    if (isTimelinePlaying) {
      startProgress();
    }
  }, [currentTimelineIndex, isTimelinePlaying]);

  const handleTimelineClick = (index: number) => {
    setIsTimelinePlaying(false);
    setCurrentTimelineIndex(index);
    setProgress(0);
    
    // Resume auto-play after 2 seconds
    setTimeout(() => {
      setIsTimelinePlaying(true);
    }, 2000);
  };

  const togglePlayPause = () => {
    setIsTimelinePlaying(!isTimelinePlaying);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          key={currentHeroVideoIndex}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop"
        >
          <source
            src={heroVideos[currentHeroVideoIndex]}
            type="video/mp4"
          />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop"
            alt="Fashion background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </video>

        {/* Overlay with reduced opacity */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl mb-6 text-white drop-shadow-lg">
            About DevīCo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
            Redefining fashion with sustainability, ethics, and style at our core
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Our Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DevīCo was born from a simple belief: fashion should be beautiful, sustainable, and accessible to everyone. 
              Our journey began with a mission to create clothing that respects both people and planet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl mb-6 text-gray-900">
                From Vision to Reality
              </h3>
              <p className="text-gray-600 mb-6">
                Founded in 2023, DevīCo emerged from the conviction that the fashion industry needed a fundamental shift. 
                We started with a small team of passionate designers and sustainability experts who shared a common goal: 
                to prove that ethical fashion could be both stylish and affordable.
              </p>
              <p className="text-gray-600 mb-6">
                Our name, DevīCo, combines 'Devi' (goddess in Sanskrit, representing feminine power) with 'Co' (company/community), 
                symbolizing our commitment to empowering women while building a sustainable future together.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-700">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  <span>100% Sustainable Materials</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  <span>Ethical Manufacturing</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Community Focused</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop"
                alt="DevīCo team at work"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl text-gray-900 mb-1">50K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to a global sustainable fashion leader, explore the key milestones that shaped DevīCo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
            {/* Timeline Navigation */}
            <div className="space-y-4 pr-8">
              {timelineData.map((item, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                    index === currentTimelineIndex
                      ? 'bg-white shadow-lg border-l-4 border-gray-900'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => handleTimelineClick(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">{item.year}</span>
                    {index === currentTimelineIndex && (
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
              
              {/* Play/Pause Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={togglePlayPause}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                >
                  {isTimelinePlaying ? 'Pause' : 'Play'}
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </button>
              </div>
            </div>

            {/* Timeline Content */}
            <div className="relative h-full min-h-[600px] max-h-[600px] overflow-hidden">
              {timelineData[currentTimelineIndex].imageUrl ? (
                <ImageWithFallback
                  src={timelineData[currentTimelineIndex].imageUrl}
                  alt={timelineData[currentTimelineIndex].title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  key={currentTimelineIndex}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={timelineData[currentTimelineIndex].posterUrl}
                >
                  <source
                    src={timelineData[currentTimelineIndex].videoUrl}
                    type="video/mp4"
                  />
                  <ImageWithFallback
                    src={timelineData[currentTimelineIndex].posterUrl}
                    alt={timelineData[currentTimelineIndex].title}
                    className="w-full h-full object-cover"
                  />
                </video>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from design to delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-3 text-gray-900">
                  Sustainability
                </h3>
                <p className="text-gray-600">
                  Every piece is crafted with environmentally conscious materials and processes, 
                  ensuring minimal impact on our planet.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl mb-3 text-gray-900">
                  Ethical Production
                </h3>
                <p className="text-gray-600">
                  We partner with fair-trade manufacturers who share our commitment to 
                  worker rights and safe working conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl mb-3 text-gray-900">
                  Quality & Style
                </h3>
                <p className="text-gray-600">
                  Timeless designs meet modern aesthetics, creating pieces that are both 
                  beautiful and built to last.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Join the DevīCo Movement
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of the sustainable fashion revolution. Together, we're creating a better future for fashion.
          </p>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Shop Our Collection
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}