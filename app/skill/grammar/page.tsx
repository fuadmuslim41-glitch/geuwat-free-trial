import Link from '../../components/HoverPrefetchLink';
import BackButton from '../components/BackButton';
import './grammar.css';

export default function GrammarPage() {
  return (
    <main className="grammar-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill" />
      </div>

      <div className="grammar-shell">
        <h1 className="grammar-title">Grammar</h1>
        <p className="grammar-subtitle">Pilih jalur grammar yang ingin dipelajari.</p>

        <div className="grammar-triangle">
          <Link prefetch={false} prefetchOnHover={false}
            href="/skill/grammar/grammar-resource"
            className="grammar-btn grammar-btn-top"
            data-tour="grammar-resource-button"
          >
            Grammar Resource
          </Link>
        </div>
      </div>
    </main>
  );
}
