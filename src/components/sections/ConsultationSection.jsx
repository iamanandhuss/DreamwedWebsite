    import React from "react";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import capure1 from "../../assets/images/capture1.png";
import capure2 from "../../assets/images/capture2.png";
import capure3 from "../../assets/images/capture3.png";
import capure4 from "../../assets/images/capture4.png";
import capure5 from "../../assets/images/capture5.png";
import capure6 from "../../assets/images/capture6.png";

const ConsultationSection = () => {
  return (
    <section className="w-full bg-[#f5f5f3] pt-20 md:pt-32 pb-32 md:pb-48 px-4 md:px-6">
      <div
        className="
          max-w-7xl
          mx-auto
          bg-[#ececea]
          rounded-[30px]
          md:rounded-[40px]
          p-8
          md:p-12
          lg:p-16
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-12
          md:gap-16
          items-center
          shadow-sm
        "
      >

        {/* LEFT CONTENT */}
        <div className="max-w-3xl">
          <h2
            className="
              text-[36px]
              sm:text-[48px]
              md:text-[80px]
              leading-[1.1]
              md:leading-[0.95]
              tracking-[-0.04em]
              text-black
              font-normal
              text-balance
            "
          >
            Ready to capture your love story?
          </h2>

          <p
            className="
              mt-6
              md:mt-8
              text-[18px]
              md:text-[28px]
              leading-relaxed
              text-[#697169]
              max-w-2xl
              font-light
            "
          >
            Book a free consultation to speak with our lead photographers
            and discuss your wedding vision. Let’s create a timeless narrative
            of your special day.
          </p>

          <Button 
            to="/contact"
            variant="dark"
            className="mt-10 md:mt-12 h-[64px] md:h-[76px] text-[18px] md:text-[24px] w-full sm:w-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-500"
          >
            Book my free consultation
            <ArrowRight size={24} className="md:w-7 md:h-7" />
          </Button>
        </div>

        {/* RIGHT IMAGE GRID */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 h-[450px] md:h-[650px]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 md:gap-5">
            <img
              src={capure6}
              alt="Wedding Moment 6"
              className="h-[120px] md:h-[180px] w-full object-cover rounded-[20px] md:rounded-[28px] shadow-md"
            />
            <img
              src={capure5}
              alt="Wedding Moment 5"
              className="flex-1 w-full object-cover rounded-[20px] md:rounded-[28px] shadow-md"
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 md:gap-5">
            <img
              src={capure4}
              alt="Wedding Moment 4"
              className="flex-1 w-full object-cover rounded-[20px] md:rounded-[28px] shadow-md"
            />
            <img
              src={capure1}
              alt="Wedding Moment 1"
              className="h-[140px] md:h-[220px] w-full object-cover rounded-[20px] md:rounded-[28px] shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;