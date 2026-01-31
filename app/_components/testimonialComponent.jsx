import { TestimonialCard } from "../_molecules/testimonialCard";
import { Header2 } from "../_atoms/Headers";
import Icon from "../_atoms/Icon";
import { ManIcon } from "../_atoms/Icons";

const TestimonialComponent = ({ testimonialData, titleContent }) => {
  return (
    <div className="flex flex-col w-full my-4 py-12 px-4 md:px-8 lg:px-20">
      <div className="flex text-center justify-center mb-8">
        <Header2>{titleContent?.title}</Header2>
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center">
          {testimonialData.map((testimonial, index) => (
            <div
              key={index}
              className="w-full max-w-sm"
            >
              <TestimonialCard
                quote={testimonial?.quote}
                authorName={testimonial?.authorName}
                authorTitle={testimonial?.authorTitle}
                authorImage={testimonial?.authorImage}
                courseLink={testimonial?.courseLink}
                courseTitle={testimonial?.courseTitle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialComponent;
