import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ensureTrailingSlash } from '@/utils/urlUtils';

const TrailingSlashRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    const normalizedPath = ensureTrailingSlash(currentPath);
    
    // If the current path doesn't have a trailing slash and should have one
    if (currentPath !== normalizedPath && !currentPath.includes('.')) {
      // Perform 301 redirect by replacing the current history entry
      const newUrl = `${normalizedPath}${location.search}${location.hash}`;
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default TrailingSlashRedirect;