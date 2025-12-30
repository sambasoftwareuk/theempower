import CarouselSliderComponent from "../_components/carouselSliderComponent";
import ProductCardWithImage from "./ProductCardWithImage";
import { Header2 } from "../_atoms/Headers";
import Link from "next/link";

const PhotoSlider = ({ title, data }) => {
  return (
    <>
      <div className="flex justify-center mt-8">
        <Header2>{title}</Header2>
      </div>
      <CarouselSliderComponent>
        {data?.map((item) => (
            <Link href={`/content/${item?.slug}`}>
          <div key={item?.id} className="px-12 flex justify-center h-full">
              <ProductCardWithImage
                title={item?.title}
                variant={3}
                button={false}
                imageLink={item?.hero?.file_path ? item.hero?.file_path : "/generic-image.png"}
                />
          </div>
            </Link>
        ))}
      </CarouselSliderComponent>
    </>
  );
};

export default PhotoSlider;
