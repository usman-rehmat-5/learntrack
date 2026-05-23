import { getIcon } from '../utils/iconMap';

function FieldIcon({ name, className = 'text-lg', fallback = true }) {
  const IconComponent = getIcon(name);
  return IconComponent ? <IconComponent className={className} /> : null;
}

export default FieldIcon;
