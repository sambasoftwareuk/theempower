import Icon from "./_atoms/Icon";
import { Cart, Search, Globe, Star, HalfStar } from "./_atoms/Icons";
import Input from "../app/_atoms/input";

export default function Home() {
  return (
    <div>
      <Icon variant={Cart} size={32} color="#000000" />
      <Icon variant={Search} size={32} color="red" />
      <Icon variant={Globe} size={32} color="grey" />
      <Icon variant={Star} size={32} color="green" />
      <Icon variant={HalfStar} size={32} color="blue" />

      <div>
        Empower Project
        <Input placeholder="Enter .." variant="basic" />
        {/* `     <Input
        placeholder="Enter ..."
        variant='iconEnd'
        icon={search}
        onIconClick={()=>console.log('clear click')}
      />` */}
      </div>
    </div>
  );
}
