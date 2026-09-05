import React from 'react';
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Car,
  Smartphone,
  Sparkles,
  Truck,
  CarTaxiFront,
  Activity,
  HeartPulse,
  Home,
  Scissors,
  Flame,
  Shirt,
  ShieldCheck,
  Trees,
  HelpCircle
} from 'lucide-react';

export function getCategoryIcon(category: string, className: string = 'w-5 h-5'): React.ReactNode {
  switch (category) {
    case 'plumber':
      return <Wrench className={className} />;
    case 'building_electrician':
      return <Zap className={className} />;
    case 'painter':
      return <Paintbrush className={className} />;
    case 'carpenter':
      return <Hammer className={className} />;
    case 'mechanic':
    case 'auto_electrician':
    case 'used_cars':
      return <Car className={className} />;
    case 'tech_repair':
    case 'appliance_repair':
      return <Smartphone className={className} />;
    case 'cleaner':
      return <Sparkles className={className} />;
    case 'taxi_driver':
      return <CarTaxiFront className={className} />;
    case 'freight_transporter':
    case 'delivery_worker':
      return <Truck className={className} />;
    case 'physiotherapist':
      return <Activity className={className} />;
    case 'home_nurse':
      return <HeartPulse className={className} />;
    case 'barber':
    case 'hairdresser':
    case 'tailor':
      return <Scissors className={className} />;
    case 'mason':
    case 'tile_setter':
    case 'plasterer':
      return <Home className={className} />;
    case 'welder':
      return <Flame className={className} />;
    case 'gardener':
      return <Trees className={className} />;
    case 'real_estate_agent':
      return <ShieldCheck className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
