import { CardImage } from "../_atoms/images";
import { Header3 } from "../_atoms/Headers";
import { SambaLinks } from "../_atoms/SambaLinks";

const SimpleCard = ({ id, title, image }) => {
  return (
    <SambaLinks href={`/career/${id}`} className="block">
      <div className="w-full max-w-[250px] aspect-[3/4] rounded-md overflow-hidden shadow-md border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg">
        <div className="relative w-full h-[45%]">
          <CardImage imageLink={image} imageAlt={title} />
        </div>

        <div className="p-3 h-[55%] flex items-start justify-center">
          <Header3 className="text-sm font-semibold text-gray-800 text-center line-clamp-3">
            {title}
          </Header3>
        </div>
      </div>
    </SambaLinks>
  );
};

export default SimpleCard;
