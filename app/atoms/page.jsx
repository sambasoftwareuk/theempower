"use client";
import Icon from "../_atoms/Icon";
import { Cart, Search, Globe, Star, HalfStar } from "../_atoms/Icons";
import {
  InputBasic,
  InputBasicWithIcon,
  InputWithClickableIcon,
  InputWithIconStart,
} from "../_atoms/inputs";

const page = () => {
  return (
    <div className="p-4">
      <Icon variant={Cart} size={32} color="#000000" />
      <Icon variant={Search} size={32} color="red" />
      <Icon variant={Globe} size={32} color="grey" />
      <Icon variant={Star} size={32} color="green" />
      <Icon variant={HalfStar} size={32} color="blue" />

      <div className="py-4 px-3 space-y-4">
        Empower Project
        <InputBasic placeholder="What do you want to learn?" />
        <InputBasicWithIcon placeholder="Search..." icon={Search} />
        <InputWithClickableIcon
          placeholder="Search..."
          icon={Search}
          onIconClick={() => console.log("click")}
        />
        <InputWithIconStart placeholder="Search..." icon={Search} />
      </div>
    </div>
  );
};

export default page;
