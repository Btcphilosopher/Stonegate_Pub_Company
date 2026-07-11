import React, { useState } from 'react';
import { Search, MapPin, Phone, Star, Map, Beer } from 'lucide-react';
import { Pub } from '../types';
import { PUBS } from '../data';

interface PubFinderProps {
  onOrderPint: (pubName: string) => void;
}

export default function PubFinder({ onOrderPint }: PubFinderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const cities = ['All', 'London', 'Manchester', 'Edinburgh', 'Birmingham', 'Leeds'];

  const filteredPubs = PUBS.filter((pub) => {
    const matchesSearch = 
      pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === 'All' || pub.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6" id="pub-finder-container">
      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/30 p-4 rounded-xl border border-brand-border/80">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pub name, city..."
            className="w-full pl-9 pr-4 py-2 bg-brand-panel border border-brand-border rounded-lg text-xs font-sans text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold transition-all duration-200"
            id="pub-search-input"
          />
        </div>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap gap-2 items-center justify-start w-full md:w-auto" id="pub-city-filters">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-space font-semibold tracking-wider uppercase transition-all duration-200 border ${
                selectedCity === city
                  ? 'bg-brand-gold border-brand-gold text-brand-bg'
                  : 'bg-transparent border-brand-border text-gray-400 hover:text-white hover:border-brand-gold/40'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Pub Cards Grid */}
      {filteredPubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="pub-cards-grid">
          {filteredPubs.map((pub) => (
            <div
              key={pub.id}
              className="flex flex-col rounded-xl border border-brand-border bg-black/40 hover:border-brand-gold/40 transition-all duration-300 overflow-hidden group"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={pub.imageUrl}
                  alt={pub.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/85 backdrop-blur-sm rounded border border-brand-border text-[9px] font-mono font-semibold tracking-wider text-brand-gold-light uppercase">
                  {pub.city}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-lg font-semibold tracking-wide text-white group-hover:text-brand-gold transition-colors duration-200">
                      {pub.name}
                    </h3>
                    <div className="flex items-center gap-1 text-brand-gold text-xs font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-brand-gold" />
                      <span>{pub.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-400 font-sans">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-brand-gold/70 shrink-0" />
                      <span>{pub.address}, {pub.postcode}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-brand-gold/70 shrink-0" />
                      <span>{pub.phone}</span>
                    </p>
                  </div>

                  {/* Amenities/Features */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {pub.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2 py-0.5 rounded bg-brand-border/50 text-[9px] font-space font-medium text-brand-gold-light"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5 pt-4 border-t border-brand-border/60">
                  <button
                    onClick={() => onOrderPint(pub.name)}
                    className="flex-1 py-2 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-bg border border-brand-gold/20 hover:border-brand-gold text-center text-[10px] font-space font-bold tracking-wider uppercase rounded-lg transition-all duration-200"
                  >
                    <Beer className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Order at Table
                  </button>
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pub.name + ' ' + pub.address)}`, '_blank')}
                    className="p-2 border border-brand-border hover:border-brand-gold/50 rounded-lg text-gray-400 hover:text-white hover:bg-brand-border/30 transition-all duration-200"
                    title="Open in Maps"
                  >
                    <Map className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-black/20 rounded-xl border border-brand-border/60">
          <p className="text-gray-400 text-sm">No pubs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
