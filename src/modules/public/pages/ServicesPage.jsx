import '../styles/ServicesPage.css';

const ServicesPage = () => {
  return (
    <div className="services-container">
      <div className="services-content">
        <h1 className="services-title">Services</h1>

        {/* Warranty Service */}
        <div className="service-section">
          <h2 className="service-heading">Warranty Service</h2>
          <p className="service-description">
            We offer a customer-friendly warranty process designed to be simple, transparent, and efficient. 
            Since most of our suppliers are located within Sri Lanka, we are able to provide faster repair 
            and replacement services.
          </p>
          
          <h3 className="service-subheading">Warranty Conditions</h3>
          <ul className="service-conditions">
            <li>Warranty is valid only under the supplier's official warranty terms & conditions.</li>
            <li>Warranty period starts from the invoice date (date of purchase).</li>
            <li>Warranty does not cover physical damage, corrosion, or burn marks.</li>
            <li>A valid proof of purchase / invoice is required to claim warranty.</li>
            <li>Warranty covers manufacturing defects only.</li>
            <li>Damages caused by misuse, negligence, power fluctuations, lightning, natural disasters, or accidents are not covered.</li>
            <li>Software issues or data loss during repair/replacement are not covered.</li>
            <li>Laptop batteries and chargers carry a 1-year limited warranty.</li>
          </ul>
        </div>

        {/* Pre-Order Service */}
        <div className="service-section">
          <h2 className="service-heading">Pre-Order Service</h2>
          <p className="service-description">
            Looking for a laptop or accessory that is not available locally?
            Ozone Computers Pre-Order Service allows you to request specific models or configurations from international suppliers.
          </p>
          
          <h3 className="service-subheading">Pre-Order Conditions</h3>
          <ul className="service-conditions">
            <li>A minimum 50% advance payment is required to confirm the order.</li>
            <li>Advance payments are non-refundable once the order is placed.</li>
            <li>Delivery timelines depend on supplier availability and shipping duration.</li>
          </ul>
        </div>

        {/* Island-Wide Home Delivery */}
        <div className="service-section">
          <h2 className="service-heading">Island-Wide Home Delivery</h2>
          <p className="service-description">
            We provide fast and secure doorstep delivery to every corner of Sri Lanka. Our delivery network 
            ensures your products arrive safely and on time.
          </p>
          
          <h3 className="service-subheading">Pre-Order Conditions</h3>
          <ul className="service-conditions">
            <li>Full payment (100%) must be completed before dispatch.</li>
            <li>Payments can be made via bank transfer (details provided upon request).</li>
            <li>Deliveries are handled through trusted courier partners.</li>
            <li>Free delivery is available for orders above LKR 100,000.</li>
            <li>Orders below this value will include a standard delivery fee.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
