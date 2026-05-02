const ServicesPage = () => {
  return (
    <div className="w-full bg-white py-10 px-5">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-[2.5rem] font-semibold text-center mb-10 text-black">Services</h1>

        {/* Warranty Service */}
        <div className="mb-12">
          <h2 className="text-[1.8rem] font-semibold text-black mb-4">Warranty Service</h2>
          <p className="text-base leading-[1.6] text-[#333333] mb-5 text-justify">
            We offer a customer-friendly warranty process designed to be simple, transparent, and efficient.
            Since most of our suppliers are located within Sri Lanka, we are able to provide faster repair
            and replacement services.
          </p>

          <h3 className="text-[1.1rem] font-semibold mt-4 mb-4">Warranty Conditions</h3>
          <ul className="list-disc pl-6 text-[#333333]">
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Warranty is valid only under the supplier's official warranty terms & conditions.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Warranty period starts from the invoice date (date of purchase).</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Warranty does not cover physical damage, corrosion, or burn marks.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">A valid proof of purchase / invoice is required to claim warranty.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Warranty covers manufacturing defects only.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Damages caused by misuse, negligence, power fluctuations, lightning, natural disasters, or accidents are not covered.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Software issues or data loss during repair/replacement are not covered.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Laptop batteries and chargers carry a 1-year limited warranty.</li>
          </ul>
        </div>

        {/* Pre-Order Service */}
        <div className="mb-12">
          <h2 className="text-[1.8rem] font-semibold text-black mb-4">Pre-Order Service</h2>
          <p className="text-base leading-[1.6] text-[#333333] mb-5 text-justify">
            Looking for a laptop or accessory that is not available locally?
            Ozone Computers Pre-Order Service allows you to request specific models or configurations from international suppliers.
          </p>

          <h3 className="text-[1.1rem] font-semibold mt-4 mb-4">Pre-Order Conditions</h3>
          <ul className="list-disc pl-6 text-[#333333]">
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">A minimum 50% advance payment is required to confirm the order.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Advance payments are non-refundable once the order is placed.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Delivery timelines depend on supplier availability and shipping duration.</li>
          </ul>
        </div>

        {/* Island-Wide Home Delivery */}
        <div className="mb-12">
          <h2 className="text-[1.8rem] font-semibold text-black mb-4">Island-Wide Home Delivery</h2>
          <p className="text-base leading-[1.6] text-[#333333] mb-5 text-justify">
            We provide fast and secure doorstep delivery to every corner of Sri Lanka. Our delivery network
            ensures your products arrive safely and on time.
          </p>

          <h3 className="text-[1.1rem] font-semibold mt-4 mb-4">Pre-Order Conditions</h3>
          <ul className="list-disc pl-6 text-[#333333]">
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Full payment (100%) must be completed before dispatch.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Payments can be made via bank transfer (details provided upon request).</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Deliveries are handled through trusted courier partners.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Free delivery is available for orders above LKR 100,000.</li>
            <li className="mb-2.5 leading-[1.6] text-[0.95rem]">Orders below this value will include a standard delivery fee.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
