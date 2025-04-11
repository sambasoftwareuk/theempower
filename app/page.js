import Icon from "./_atoms/Icon";
import { Cart, Search, Globe, Star, HalfStar } from "./_atoms/Icons";

export default function Home() {
  return (
    <div>
      <Icon variant={Cart} size={32} color="#000000" />
      <Icon variant={Search} size={32} color="red" />
      <Icon variant={Globe} size={32} color="grey" />
      <Icon variant={Star} size={32} color="green" />
      <Icon variant={HalfStar} size={32} color="blue" />


    </div>
  );
}
