import { useState } from 'react';
import {
  ShoppingBag,
  Star,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  Clock,
  Tag,
  Package
} from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

 

  const deals = [
    { id: 1, name: 'Flash Sale: Up to 50% Off', ends: '2h 45m', icon: <Zap /> },
    { id: 2, name: 'New Arrivals: Extra 15% Off', ends: '1d 12h', icon: <TrendingUp /> },
    { id: 3, name: 'Free Shipping on Orders $75+', ends: 'Today', icon: <Package /> },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

        <header style={styles.header}>
        <div style={styles.topBar}>
          <div style={styles.container}>
            <div style={styles.topBarContent}>
              <span style={styles.topBarText}>🎉 Season Sale: Up to 60% Off | Free Shipping on Orders $75+</span>
             
            </div>
          </div>
        </div>

       

      
      </header>

      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <span style={styles.heroBadge}>
              <Award size={16} />
              Premium Collection 2026
            </span>
            <h1 style={styles.heroTitle}>
              Discover Your
              <span style={styles.heroTitleAccent}> Perfect Style</span>
            </h1>
            <p style={styles.heroDescription}>
              Shop the latest trends with exclusive deals on premium brands.
              Quality guaranteed, style perfected.
            </p>
            <div style={styles.heroButtons}>
              <button style={styles.heroPrimaryButton}>
                Shop Now
                <ChevronRight size={20} />
              </button>
              <button style={styles.heroSecondaryButton}>
                Go to Products Page
              </button>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNumber}>50K+</div>
                <div style={styles.heroStatLabel}>Happy Customers</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNumber}>10K+</div>
                <div style={styles.heroStatLabel}>Products</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatNumber}>4.9★</div>
                <div style={styles.heroStatLabel}>Average Rating</div>
              </div>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroImageContainer}>
              <img
                src="https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hero"
                style={styles.heroImage}
              />
              <div style={styles.heroFloatingCard}>
                <Star size={24} color="#FFD700" fill="#FFD700" />
                <div>
                  <div style={styles.floatingCardTitle}>Trending Now</div>
                  <div style={styles.floatingCardText}>Top Rated Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.dealsSection}>
        <div style={styles.container}>
          <div style={styles.dealsGrid}>
            {deals.map((deal) => (
              <div key={deal.id} style={styles.dealCard}>
                <div style={styles.dealIcon}>{deal.icon}</div>
                <div style={styles.dealContent}>
                  <div style={styles.dealTitle}>{deal.name}</div>
                  <div style={styles.dealTime}>
                    <Clock size={14} />
                    Ends in {deal.ends}
                  </div>
                </div>
                <ChevronRight size={20} color="#FF6B35" />
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* <section style={styles.featuresSection}>
        <div style={styles.container}>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Package size={32} color="#FF6B35" />
              </div>
              <h3 style={styles.featureTitle}>Free Shipping</h3>
              <p style={styles.featureText}>On orders over $75</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Award size={32} color="#4ECDC4" />
              </div>
              <h3 style={styles.featureTitle}>Quality Guaranteed</h3>
              <p style={styles.featureText}>100% authentic products</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Clock size={32} color="#95E1D3" />
              </div>
              <h3 style={styles.featureTitle}>Easy Returns</h3>
              <p style={styles.featureText}>30-day return policy</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Tag size={32} color="#F38181" />
              </div>
              <h3 style={styles.featureTitle}>Best Prices</h3>
              <p style={styles.featureText}>Unbeatable deals daily</p>
            </div>
          </div>
        </div>
      </section> */}

      <section style={styles.newsletterSection}>
        <div style={styles.container}>
          <div style={styles.newsletterContent}>
            <div style={styles.newsletterLeft}>
              <h2 style={styles.newsletterTitle}>Join Our VIP Club</h2>
              <p style={styles.newsletterText}>
                Get exclusive access to deals, early product launches, and special discounts.
              </p>
            </div>
            <div style={styles.newsletterRight}>
              <form style={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={styles.newsletterInput}
                />
                <button type="submit" style={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div style={styles.footerColumn}>
              <div style={styles.footerLogo}>
                <ShoppingBag size={28} color="#FF6B35" />
                <span style={styles.footerLogoText}>MegaMart</span>
              </div>
              <p style={styles.footerDescription}>
                Your destination for premium products and exceptional shopping experiences.
              </p>
            </div>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Shop</h4>
              <a href="#" style={styles.footerLink}>New Arrivals</a>
              <a href="#" style={styles.footerLink}>Best Sellers</a>
              <a href="#" style={styles.footerLink}>Sale</a>
              <a href="#" style={styles.footerLink}>Collections</a>
            </div>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Support</h4>
              <a href="#" style={styles.footerLink}>Contact Us</a>
              <a href="#" style={styles.footerLink}>FAQs</a>
              <a href="#" style={styles.footerLink}>Shipping Info</a>
              <a href="#" style={styles.footerLink}>Returns</a>
            </div>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Company</h4>
              <a href="#" style={styles.footerLink}>About Us</a>
              <a href="#" style={styles.footerLink}>Careers</a>
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
              <a href="#" style={styles.footerLink}>Terms of Service</a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>© 2026 MegaMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    margin: '0 auto',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  topBar: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '8px 0',
    fontSize: '13px',
  },
  topBarContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarText: {
    fontWeight: 500,
  },
  topBarLinks: {
    display: 'flex',
    gap: '20px',
  },
  topBarLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '13px',
    opacity: 0.9,
  },
  nav: {
    padding: '16px 0',
    borderBottom: '1px solid #eee',
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
  },
  searchBar: {
    flex: 1,
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '50px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '15px',
  },
  navActions: {
    display: 'flex',
    gap: '24px',
  },
  iconButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    position: 'relative',
  },
  iconLabel: {
    fontSize: '12px',
    fontWeight: 500,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -8,
  },
  badge: {
    backgroundColor: '#FF6B35',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '10px',
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  categoryBar: {
    borderTop: '1px solid #eee',
    padding: '12px 0',
  },
  categories: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  categoryButton: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    color: '#666',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    color: '#fff',
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '80px 24px',
    color: '#fff',
  },
  heroContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    width: 'fit-content',
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
  },
  heroTitleAccent: {
    display: 'block',
    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroDescription: {
    fontSize: '18px',
    lineHeight: 1.6,
    opacity: 0.95,
    maxWidth: '500px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  heroPrimaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    backgroundColor: '#FF6B35',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  heroSecondaryButton: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  heroStats: {
    display: 'flex',
    gap: '40px',
    marginTop: '24px',
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  heroStatNumber: {
    fontSize: '32px',
    fontWeight: 900,
  },
  heroStatLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center',
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  },
  heroImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '30px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
  },
  heroFloatingCard: {
    position: 'absolute',
    bottom: '30px',
    left: '-30px',
    backgroundColor: '#fff',
    color: '#333',
    padding: '20px 24px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  floatingCardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  floatingCardText: {
    fontSize: '14px',
    color: '#666',
  },
  dealsSection: {
    padding: '40px 24px',
    backgroundColor: '#fff',
  },
  dealsGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  dealCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#FFF9F5',
    borderRadius: '16px',
    border: '2px solid #FFE8DC',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  dealIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: '#FF6B35',
    color: '#fff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealContent: {
    flex: 1,
  },
  dealTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  dealTime: {
    fontSize: '13px',
    color: '#FF6B35',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
  },
  productsSection: {
    padding: '80px 24px',
    backgroundColor: '#f9f9f9',
  },
  sectionHeader: {
    maxWidth: '1400px',
    margin: '0 auto 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#1a1a1a',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#666',
    marginTop: '8px',
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#fff',
    border: '2px solid #FF6B35',
    borderRadius: '25px',
    color: '#FF6B35',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  productsGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  productImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '280px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: '#FF6B35',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 700,
  },
  wishlistButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  productInfo: {
    padding: '20px',
  },
  productCategory: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#FF6B35',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '8px 0',
    lineHeight: 1.4,
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '8px 0',
  },
  ratingText: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  reviewCount: {
    fontSize: '13px',
    color: '#999',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  originalPrice: {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
  },
  currentPrice: {
    fontSize: '24px',
    fontWeight: 900,
    color: '#1a1a1a',
  },
  addToCartButton: {
    width: '44px',
    height: '44px',
    backgroundColor: '#FF6B35',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  bannersSection: {
    padding: '40px 24px',
    backgroundColor: '#fff',
  },
  bannersGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  banner: {
    height: '300px',
    borderRadius: '24px',
    padding: '40px',
    display: 'flex',
    alignItems: 'flex-end',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  banner1: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800)',
  },
  banner2: {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800)',
  },
  bannerContent: {
    color: '#fff',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: '32px',
    fontWeight: 800,
    marginBottom: '8px',
  },
  bannerText: {
    fontSize: '18px',
    marginBottom: '20px',
    opacity: 0.95,
  },
  bannerButton: {
    padding: '12px 28px',
    backgroundColor: '#fff',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  featuresSection: {
    padding: '80px 24px',
    backgroundColor: '#f9f9f9',
  },
  featuresGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    transition: 'transform 0.3s ease',
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#FFF9F5',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '15px',
    color: '#666',
  },
  newsletterSection: {
    padding: '80px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  newsletterContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  newsletterLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  newsletterTitle: {
    fontSize: '48px',
    fontWeight: 900,
    margin: 0,
  },
  newsletterText: {
    fontSize: '18px',
    lineHeight: 1.6,
    opacity: 0.95,
  },
  newsletterRight: {
    display: 'flex',
    justifyContent: 'center',
  },
  newsletterForm: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  newsletterInput: {
    flex: 1,
    padding: '16px 24px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '15px',
    outline: 'none',
  },
  newsletterButton: {
    padding: '16px 40px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'transform 0.3s ease',
  },
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '60px 24px 24px',
  },
  footerGrid: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  footerLogoText: {
    fontSize: '20px',
    fontWeight: 800,
  },
  footerDescription: {
    fontSize: '14px',
    lineHeight: 1.6,
    opacity: 0.8,
  },
  footerHeading: {
    fontSize: '16px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  footerLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  },
  footerBottom: {
    maxWidth: '1400px',
    margin: '0 auto',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '14px',
    opacity: 0.7,
  },
};

export default App;
