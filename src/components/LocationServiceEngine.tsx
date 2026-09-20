import React, { useState, useEffect } from 'react';
import { Country, City, Location, Service, AvailabilityStatus } from '../types';
import { api } from '../services/api';
import { MapPin, CheckCircle2, AlertCircle, Clock, Calendar, ArrowRight, Shield, Sparkles } from 'lucide-react';

interface LocationServiceEngineProps {
  onSelectDestination?: (location: Location, service?: Service) => void;
  openEnquiryModal: (serviceId?: number, destination?: string) => void;
}

export const LocationServiceEngine: React.FC<LocationServiceEngineProps> = ({ openEnquiryModal }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationServices, setLocationServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);

  // Load initial countries
  useEffect(() => {
    async function loadData() {
      try {
        const countryList = await api.getCountries();
        setCountries(countryList);
        if (countryList.length > 0) {
          // Default to India
          const defaultCountry = countryList.find(c => c.slug === 'india') || countryList[0];
          setSelectedCountryId(defaultCountry.id);
        }
      } catch (err) {
        console.error('Failed to load countries', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When selected country changes, load its cities
  useEffect(() => {
    if (!selectedCountryId) return;

    async function loadCities() {
      try {
        const cityList = await api.getCitiesByCountry(selectedCountryId!);
        setCities(cityList);
        if (cityList.length > 0) {
          // Default to Kolkata if in India, else first city
          const defaultCity = cityList.find(c => c.slug === 'kolkata') || cityList[0];
          setSelectedCityId(defaultCity.id);
        } else {
          setSelectedCityId(null);
          setCurrentLocation(null);
          setLocationServices([]);
        }
      } catch (err) {
        console.error('Failed to load cities', err);
      }
    }
    loadCities();
  }, [selectedCountryId]);

  // When city changes, load corresponding location and services
  useEffect(() => {
    if (!selectedCountryId || !selectedCityId) return;

    async function loadLocationDetails() {
      setServicesLoading(true);
      try {
        const country = countries.find(c => c.id === selectedCountryId);
        const city = cities.find(c => c.id === selectedCityId);

        if (country && city) {
          const loc = await api.getLocationByCountryCity(country.slug, city.slug);
          setCurrentLocation(loc);

          if (loc) {
            const srvs = await api.getLocationServices(loc.id);
            setLocationServices(srvs);
          } else {
            setLocationServices([]);
          }
        }
      } catch (err) {
        console.error('Failed to load location services', err);
      } finally {
        setServicesLoading(false);
      }
    }

    loadLocationDetails();
  }, [selectedCityId, selectedCountryId, countries, cities]);

  const getStatusBadge = (status?: AvailabilityStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Active Service Hub
          </span>
        );
      case 'ON_REQUEST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Available On Request
          </span>
        );
      case 'LIMITED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
            Limited Coordination
          </span>
        );
      case 'COMING_SOON':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            Expansion Phase
          </span>
        );
    }
  };

  const selectedCountry = countries.find(c => c.id === selectedCountryId);
  const selectedCity = cities.find(c => c.id === selectedCityId);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="destination-engine">
      {/* Engine Header */}
      <div className="bg-linear-to-r from-[#075985] to-[#0369a1] text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#38BDF8]" />
              <span className="text-xs font-bold tracking-wider uppercase text-sky-200">
                Interactive Coordination Directory
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-serif">
              Explore Destinations & Available Services
            </h3>
            <p className="text-sm text-sky-100 mt-1 max-w-2xl">
              Select a target country and healthcare city to check live operational availability and our specific service coordination scope.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3.5 shrink-0 text-right">
            <span className="text-xs text-slate-200 block">Headquartered In</span>
            <strong className="text-base text-white block">Kolkata – 700 008, WB</strong>
            <span className="text-[11px] text-[#FFDF73]">Cross-border & Inter-city</span>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/15">
          {/* Country Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1.5">
              1. Select Destination Country:
            </label>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountryId(country.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    selectedCountryId === country.id
                      ? 'bg-white text-[#075985] shadow-sm font-bold scale-102'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1.5">
              2. Select Medical Hub / City:
            </label>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCityId === city.id
                      ? 'bg-[#F4C430] text-slate-900 shadow-sm font-bold scale-102'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engine Body */}
      <div className="p-6 md:p-8">
        {loading || servicesLoading ? (
          <div className="py-12 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-[#075985] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Retrieving destination coordination parameters...</p>
          </div>
        ) : currentLocation ? (
          <div className="space-y-8">
            {/* Destination Highlight Box */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h4 className="text-xl font-bold text-slate-900 font-serif">
                    {currentLocation.title}
                  </h4>
                  {getStatusBadge(currentLocation.availability_status)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {currentLocation.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Last Verified: {currentLocation.last_verified_date || '2026-07-15'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    Accredited Healthcare Ecosystem
                  </span>
                </div>
              </div>

              <button
                onClick={() => openEnquiryModal(undefined, `${selectedCity?.name}, ${selectedCountry?.name}`)}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#075985] hover:bg-[#0369a1] shadow-xs hover:shadow-md transition-all shrink-0"
              >
                Enquire for {selectedCity?.name}
                <ArrowRight className="w-4 h-4 ml-1 text-[#F4C430]" />
              </button>
            </div>

            {/* Services for this location */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    Coordination Services Available in {selectedCity?.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    All coordination services are non-clinical logistics and administrative liaison.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-[#075985] rounded-md border border-sky-100">
                  {locationServices.length} Services Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-sm bg-white transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="font-semibold text-slate-800 text-sm leading-snug">
                          {service.name}
                        </h5>
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {service.availability_status || 'Available'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {service.short_description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-[11px] text-slate-400">
                        {service.requirements ? 'Requires medical report' : 'General enquiry'}
                      </span>
                      <button
                        onClick={() => openEnquiryModal(service.id, `${selectedCity?.name}, ${selectedCountry?.name}`)}
                        className="text-xs font-semibold text-[#075985] hover:text-[#0284C7] flex items-center gap-0.5"
                      >
                        Request Service
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-600 text-sm">
              Coordination services for this specific city are currently prepared upon tailored request.
            </p>
            <button
              onClick={() => openEnquiryModal(undefined, `${selectedCity?.name || 'Selected City'}, ${selectedCountry?.name}`)}
              className="mt-3 inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#075985] rounded-lg"
            >
              Submit Customized Travel Request
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
