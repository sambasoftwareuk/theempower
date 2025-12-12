import CarouselSliderComponent from "../_components/carouselSliderComponent";
import ProductCardWithImage from "./ProductCardWithImage";
import { Header2 } from "../_atoms/Headers";

const PhotoSlider = ({ title, data }) => {
  return (
    <>
      <div className="flex justify-center mt-8">
        <Header2>{title}</Header2>
      </div>
      <CarouselSliderComponent>
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-center px-4  min-w-[300px] max-w-[350px] w-full "
          >
            <ProductCardWithImage
              title={item.title}
              variant={3}
              button={false}
              imageLink={item?.image ? item.image : "/generic-image.png"}
            />
          </div>
        ))}
      </CarouselSliderComponent>
    </>
  );
};

export default PhotoSlider;
