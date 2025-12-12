import { TestimonialCard } from "../_molecules/testimonialCard";
import { Header2 } from "../_atoms/Headers";
import Icon from "../_atoms/Icon";
import { ManIcon } from "../_atoms/Icons";

const TestimonialComponent = ({ testimonialData, titleContent }) => {
  return (
    <div className="flex flex-col w-full my-4 py-10 px-20 bg-slate-100">
      <div className="flex text-center justify-center">
        <Header2>{titleContent?.title}</Header2>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-5 w-full">
        {testimonialData.map((testimonial, index) => (
          <div
            key={index}
            className="w-full md:w-[48%] xl:w-[20%] flex justify-center"
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
  );
};

export default TestimonialComponent;
