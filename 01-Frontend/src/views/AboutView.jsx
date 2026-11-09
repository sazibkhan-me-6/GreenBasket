import React from 'react';
import {
  Sprout, Leaf, Heart, ShieldCheck, Truck, CheckCircle2,
  ArrowRight, Users, Award, Globe
} from 'lucide-react';

export default function AboutView({ navigateTo, photo }) {
  return (
    <div className="about-page section-wrap">
      {/* Breadcrumb & Header */}
      <div className="page-header-banner">
        <div className="page-breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <span>/</span>
          <span className="current">Our Story & Farm</span>
        </div>
        <h1>From Our Fields To <em>Your Family Table</em></h1>
        <p>Connecting conscious eaters with sustainable local growers dedicated to 100% certified organic cultivation.</p>
      </div>

      {/* Main Story Hero Split */}
      <div className="about-story-grid">
        <div className="about-story-text">
          <span className="kicker">OUR FOUNDING MISSION</span>
          <h2>Real, Living Food, Grown the Way Nature Intended</h2>
          <p>
            GreenBasket was born from a simple conviction: nutritious, chemical-free food should not be a luxury.
            For decades, industrial supermarket supply chains left produce sitting on shelves for weeks, stripped of natural vitamins and flavor.
          </p>
          <p>
            We partnered directly with over 25 independent local farm families who respect the soil.
            Every vegetable, fruit, and grain in your basket is harvested within 24 hours of dispatch, ensuring peak flavor and vital living enzymes.
          </p>
          <div className="about-action-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo('shop')}
            >
              Taste The Difference <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigateTo('track')}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#eff9d9',
                border: '1px solid var(--line)'
              }}
            >
              <Truck size={15} color="var(--lime)" /> Track Active Harvests
            </button>
          </div>
        </div>

        <div className="about-story-media">
          <div className="about-img-frame main-img">
            <img
              src={photo('photo-1500382017468-9049fed747ef', 800)}
              alt="Lush green organic farm fields"
            />
          </div>
          <div className="about-stamp">
            <Sprout size={24} color="var(--lime)" />
            <b>100% ORGANIC</b>
            <small>Certified Sustainable</small>
          </div>
        </div>
      </div>

      {/* Farm Stats Row */}
      <div className="about-stats-row">
        <div className="about-stat-card">
          <span className="about-stat-icon"><Sprout /></span>
          <h3>25+</h3>
          <b>Local Partner Farms</b>
          <p>Family farms operating within 100 miles of our fulfillment hubs.</p>
        </div>
        <div className="about-stat-card">
          <span className="about-stat-icon"><Leaf /></span>
          <h3>500+</h3>
          <b>Organic Produce Items</b>
          <p>Seasonal vegetables, heirloom fruits, dairy, and wholesome pantry staples.</p>
        </div>
        <div className="about-stat-card">
          <span className="about-stat-icon"><Heart /></span>
          <h3>10K+</h3>
          <b>Happy Families</b>
          <p>Reliably eating fresher, healthier, and cleaner food every week.</p>
        </div>
        <div className="about-stat-card">
          <span className="about-stat-icon"><Globe /></span>
          <h3>100%</h3>
          <b>Eco Packaging</b>
          <p>Biodegradable plant-fiber baskets and zero single-use plastics.</p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="section-block about-principles">
        <div className="section-heading">
          <div>
            <span className="heading-leaf">✦</span>
            <h2>Our 4 Golden Principles</h2>
          </div>
        </div>

        <div className="principles-grid">
          <div className="principle-card">
            <div className="principle-num">01</div>
            <h3>Zero Synthetic Chemicals</h3>
            <p>No glyphosate, synthetic pesticides, or chemical fertilizers. Tested regularly by accredited agricultural labs.</p>
          </div>
          <div className="principle-card">
            <div className="principle-num">02</div>
            <h3>Harvested at Peak Ripeness</h3>
            <p>Produce is picked when naturally ripe on the vine, delivering maximum antioxidant potency and unforgettable aroma.</p>
          </div>
          <div className="principle-card">
            <div className="principle-num">03</div>
            <h3>Direct & Fair Farmer Support</h3>
            <p>We eliminate greedy middlemen, paying our independent farmers 30% above conventional wholesale market rates.</p>
          </div>
          <div className="principle-card">
            <div className="principle-num">04</div>
            <h3>Electric Clean Delivery</h3>
            <p>Our fleet of electric vans and cargo bicycles ensures that getting fresh food to your door leaves zero carbon footprint.</p>
          </div>
        </div>
      </div>

      {/* Farm Visuals Gallery */}
      <div className="section-block about-gallery">
        <div className="gallery-grid">
          <img src={photo('photo-1540420773420-3366772f4999', 500)} alt="Fresh vegetables harvest" />
          <img src={photo('photo-1518843875459-f738682238a6', 500)} alt="Organic bell peppers and greens" />
          <img src={photo('photo-1488459716781-31db52582fe9', 500)} alt="Farm fresh produce crate" />
          <img src={photo('photo-1542838132-92c53300491e', 500)} alt="Assorted organic market produce" />
        </div>
      </div>
    </div>
  );
}
