import { Link, useParams } from 'react-router-dom';
import './Categories.scss';
import { useEffect, useState } from 'react';

export default function Categories() {
  // State to manage loading status
  const { demographic } = useParams<{ demographic: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log to confirm the demographic parameter

    // If demographic exists, stop the loading state
    if (demographic) {
      setIsLoading(false);
    }
  }, [demographic]);

  // Render a loading state while the demographic parameter is not available
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a more styled loader if needed
  }

  return (
    <main className="categoriesMainContent">
      <div className="categoriesList">
        <h1>{demographic}</h1>
        <Link className="categoriesGoBackBtn" to="/shop">
          Click here to go back!
        </Link>
        <Link to={`/shop/${demographic}/sweatshirts`}>Sweatshirts</Link>
        <Link to={`/shop/${demographic}/shoes`}>Shoes</Link>
        <Link to={`/shop/${demographic}/joggers`}>Joggers</Link>
        <Link to={`/shop/${demographic}/tops`}>Tops</Link>
        <Link to={`/shop/${demographic}/shorts`}>Shorts</Link>
        <Link to={`/shop/${demographic}/hats`}>Hats</Link>
      </div>
    </main>
  );
}
