"use client";
import { CourseTagButton, DirectionButton, IconOnlyButton, OutlinedButton, PrimaryButton, OutlinedButtonWithIcon } from "../_atoms/buttons";
import Icon from "../_atoms/Icon";
import { Cart, Search, Globe, Star, HalfStar } from "../_atoms/Icons";
import { CardImage, LogoImage, ProfileImage, SliderImage } from "../_atoms/images";
import {
  InputBasic,
  InputBasicWithIcon,
  InputWithClickableIcon,
  InputWithIconStart,
} from "../_atoms/inputs";


const page = () => {
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2">
   
        <Icon variant={Cart} size={32} color="text-primary900" />
        <Icon variant={Search} size={32} color="text-sunshine" />
        <Icon variant={Globe} size={32} color="text-secondary" />
        <Icon variant={Star} size={32} color="text-secondary200" />
        <Icon variant={HalfStar} size={32} color="text-red" />
      </div>

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
      <div className="flex flex-wrap gap-2">
        <PrimaryButton label="Login" />
        <OutlinedButton label="Register" />
        <IconOnlyButton icon={<Cart />} />
        <OutlinedButtonWithIcon icon={<Globe />} />
        <CourseTagButton label="Natural Language Processing (NLP)" active />
        <CourseTagButton label="Machine Learning" active={false} />
        <DirectionButton icon=">" />
        <DirectionButton icon="<" />
      </div>
      <div className="my-4">
        <SliderImage imageLink="/learner-centered.jpg"/>
      </div>  
      <div>
        <CardImage imageLink="/learner-centered.jpg" />
      </div>
      <div>
        <LogoImage imageLink="/empower-logo.png" />
      </div>
      <div>
        <ProfileImage imageLink="/man.png" />
      </div>
    </div>
  );
};

export default page;
