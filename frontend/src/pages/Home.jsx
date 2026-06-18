import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { Activity, ShieldCheck, Clock, Truck, ChevronRight, Calculator, Droplet, Plus, RefreshCw } from 'lucide-react';
import ProductImage from '../components/ProductImage';

const Home = () => {
  const { addToCart, showToast } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BMI CALCULATOR STATE ---
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiDesc, setBmiDesc] = useState('');
  const [bmiColor, setBmiColor] = useState('var(--primary)');

  // --- WATER TRACKER STATE ---
  const [waterWeight, setWaterWeight] = useState('70');
  const [activityLevel, setActivityLevel] = useState('medium');
  const [currentWater, setCurrentWater] = useState(0);

  // Calculate water goal dynamically
  const wt = parseFloat(waterWeight);
  const waterGoal = (wt && wt > 0)
    ? Math.round(wt * 35 + (activityLevel === 'medium' ? 500 : activityLevel === 'high' ? 1000 : 0))
    : 2500;

  // Fetch featured products (limit to 4)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success) {
          // Take products with IDs 5, 8, 9, 13 (a good mix of OTC, wellness, personal care)
          const ids = [5, 8, 9, 13];
          const filtered = data.products.filter(p => ids.includes(p.id));
          setFeaturedProducts(filtered.length > 0 ? filtered : data.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Calculate BMI
  const handleCalculateBmi = () => {
    const w = parseFloat(bmiWeight);
    const hCm = parseFloat(bmiHeight);

    if (!w || !hCm || w <= 0 || hCm <= 0) {
      showToast('Please enter valid positive numbers for Weight and Height.', 'error');
      return;
    }

    const hM = hCm / 100;
    const bmi = w / (hM * hM);
    const score = bmi.toFixed(1);
    setBmiResult(score);

    if (bmi < 18.5) {
      setBmiDesc('Underweight: We suggest consultation and protein-rich wellness diets.');
      setBmiColor('var(--warning)');
    } else if (bmi >= 18.5 && bmi < 24.9) {
      setBmiDesc('Normal: Congratulations on maintaining a healthy weight!');
      setBmiColor('var(--success)');
    } else if (bmi >= 25 && bmi < 29.9) {
      setBmiDesc('Overweight: Moderate calorie diets and physical exercises recommended.');
      setBmiColor('var(--warning)');
    } else {
      setBmiDesc('Obese: Consult doctors regarding obesity risks and cardiovascular wellness.');
      setBmiColor('var(--danger)');
    }
  };

  const handleAddWaterGlass = () => {
    setCurrentWater(prev => prev + 250);
    showToast('Added 250ml glass of water!', 'info');
  };

  const handleResetWater = () => {
    setCurrentWater(0);
  };

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={16} />
              Trusted Community Pharmacy (Since 2011)
            </div>
            <h1 className="hero-title">Your Health is Our <span>Top Priority</span></h1>
            <p className="hero-desc">
              Laxmi Narsimha Medical & General Store supplies 100% authentic medicines, daily essential healthcare products, and premium personal care items. Fast service, expert guidance, and community care, right in your neighborhood.
            </p>
            <div className="hero-btns">
              <Link to="/shop" className="btn btn-primary">Browse Medicines</Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Us
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Genuine Medicines</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years of Trust</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Quick</span>
                <span className="stat-label">Home Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-container" style={{ 
              background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))',
              height: '350px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--primary-hover)',
              textAlign: 'center'
            }}>
              <Activity size={80} style={{ animation: 'pulse 3s infinite', marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Laxmi Narsimha Store</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '300px', marginTop: '8px' }}>
                Your Trusted Health Partner
              </p>
            </div>
            <div className="hero-floating-card">
              <div className="floating-icon">
                <Clock size={20} />
              </div>
              <div className="floating-text">
                <h4 style={{ margin: 0 }}>Pharmacist Support</h4>
                <p style={{ margin: 0 }}>Proper dosage guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="section" id="services" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Our Health Services</h2>
            <p>Designed to provide comprehensive support for your family's health and wellness needs.</p>
          </div>
          
          <div className="services-grid">
            {/* Service 1 */}
            <div className="glass-card service-card">
              <div className="service-icon" aria-hidden="true">
                <ShieldCheck size={28} />
              </div>
              <h3>Affordable Pricing</h3>
              <p>We ensure that critical medicines and essential daily products are priced affordably to make healthcare accessible to all.</p>
              <Link to="/shop" className="service-link">View Pricing <ChevronRight size={16} /></Link>
            </div>

            {/* Service 2 */}
            <div className="glass-card service-card">
              <div className="service-icon" aria-hidden="true">
                <Clock size={28} />
              </div>
              <h3>Fast Store Pickup</h3>
              <p>Prepare your order online and let us package it in advance. Skip the queue and pick it up at the counter in minutes.</p>
              <Link to="/shop" className="service-link">Shop Catalog <ChevronRight size={16} /></Link>
            </div>

            {/* Service 3 */}
            <div className="glass-card service-card">
              <div className="service-icon" aria-hidden="true">
                <Truck size={28} />
              </div>
              <h3>Medication Guidance</h3>
              <p>Get professional advice on dosage, timing, and possible drug interactions from our friendly and experienced counter staff.</p>
              <Link to="/contact" className="service-link">Talk to Us <ChevronRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="section" id="featured" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Popular Healthcare Products</h2>
            <p>Browse through high-quality OTC medications, daily wellness supplements, and baby care essentials.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                border: '4px solid var(--border)', 
                borderTop: '4px solid var(--primary)', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                animation: 'spin 1s linear infinite', 
                margin: '0 auto' 
              }}></div>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(prod => (
                <div key={prod.id} className="glass-card product-card">
                  <div className="product-badge badge-otc" style={{ textTransform: 'capitalize' }}>
                    {prod.category.replace('-', ' ')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <ProductImage category={prod.category} type={prod.type} name={prod.name} size={110} imgUrl={prod.image} />
                  </div>
                  <h3>{prod.name}</h3>
                  <p className="product-desc">{prod.desc}</p>
                  <div className="product-meta">
                    <span className="product-price">₹{prod.price.toFixed(2)}</span>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => addToCart(prod)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/shop" className="btn btn-primary">View Full Catalog</Link>
          </div>
        </div>
      </section>

      {/* --- HEALTH & WELLNESS TOOLS SECTION --- */}
      <section className="section" id="wellness-tools">
        <div className="container">
          <div className="section-header">
            <h2>Interactive Health Tools</h2>
            <p>Support your daily fitness and hydration goals with our simple, instant tools.</p>
          </div>
          
          <div className="tools-grid">
            {/* BMI Calculator */}
            <div className="glass-card calculator-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Calculator className="service-icon" style={{ margin: 0, width: '40px', height: '40px', padding: '8px' }} />
                <h3 style={{ margin: 0 }}>BMI Calculator</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Check if your body mass ratio falls within standard healthy metrics.
              </p>
              
              <div className="calc-inputs-row">
                <div className="form-group">
                  <label htmlFor="bmi-weight">Weight (kg)</label>
                  <input 
                    type="number" 
                    id="bmi-weight" 
                    placeholder="e.g. 70" 
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bmi-height">Height (cm)</label>
                  <input 
                    type="number" 
                    id="bmi-height" 
                    placeholder="e.g. 175" 
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
                  />
                </div>
              </div>
              
              <button className="btn btn-primary" onClick={handleCalculateBmi}>Calculate BMI</button>
              
              <div className="calc-result-box" style={{ opacity: bmiResult ? 1 : 0.6 }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your BMI Score</h4>
                <div className="calc-result-val" style={{ color: bmiColor }}>{bmiResult || '--'}</div>
                <div className="calc-result-desc">
                  {bmiDesc || 'Enter your weight and height above to calculate.'}
                </div>
              </div>
            </div>

            {/* Water Hydration Tracker */}
            <div className="glass-card calculator-card" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', alignSelf: 'flex-start' }}>
                <Droplet className="service-icon" style={{ margin: 0, width: '40px', height: '40px', padding: '8px' }} />
                <h3 style={{ margin: 0 }}>Daily Water Hydration Tracker</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'flex-start', textAlign: 'left' }}>
                Calculate and track your hydration intake targets dynamically.
              </p>
              
              <div className="calc-inputs-row" style={{ width: '100%', textAlign: 'left' }}>
                <div className="form-group">
                  <label htmlFor="water-weight">Your Weight (kg)</label>
                  <input 
                    type="number" 
                    id="water-weight" 
                    value={waterWeight}
                    onChange={(e) => setWaterWeight(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="water-activity">Activity Level</label>
                  <select 
                    id="water-activity" 
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  >
                    <option value="low">Low (Sedentary)</option>
                    <option value="medium">Medium (Active)</option>
                    <option value="high">High (Athlete)</option>
                  </select>
                </div>
              </div>

              <div className="water-tracker-container">
                <div className="water-visual">
                  <div 
                    className="water-wave" 
                    style={{ height: `${Math.min((currentWater / waterGoal) * 100, 100)}%` }}
                  ></div>
                  <span className="water-text" style={{ color: (currentWater / waterGoal) > 0.5 ? 'white' : 'var(--text-main)' }}>
                    {currentWater} ml
                  </span>
                  <span className="water-target-label" style={{ color: (currentWater / waterGoal) > 0.5 ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                    Goal: {waterGoal} ml
                  </span>
                </div>
                
                <div className="water-btns">
                  <button className="btn btn-secondary" onClick={handleAddWaterGlass}>
                    <Plus size={16} /> Add Glass (250ml)
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '12px 16px' }} onClick={handleResetWater} title="Reset">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>We take pride in serving our community with reliable healthcare supplies and guidance.</p>
          </div>
          
          <div className="services-grid">
            <div className="glass-card" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                "Laxmi Narsimha Medical has been our family pharmacy for over 10 years. Their home delivery is extremely fast, and the pharmacist always clarifies the prescription dosage details."
              </p>
              <h4 style={{ fontWeight: 700 }}>Rajesh Kumar</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Local Resident</span>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                "The prescription upload feature is incredibly helpful. I just snap a photo of my doctor's note, upload it, and my orders are ready for pickup when I get there. Excellent customer service!"
              </p>
              <h4 style={{ fontWeight: 700 }}>Srinivas Rao</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Regular Customer</span>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                "I bought daily multivitamins and protein supplements from their wellness range. The pricing is very competitive, and their catalog has an amazing selection of personal hygiene products."
              </p>
              <h4 style={{ fontWeight: 700 }}>Ananya Reddy</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Fitness Enthusiast</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
