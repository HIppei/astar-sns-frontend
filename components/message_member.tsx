import Image from 'next/image';

type Props = {
  name: string;
  last_message: string;
  img_url: string;
};

export default function MessageMember(props: Props) {
  return (
    <div className="flex flex-row border-b-2 border-[#CECECE] w-full items-center">
      {props.img_url && (
        <Image
          className="rounded-full h-12 w-12 mx-2"
          src={props.img_url}
          alt="profile_logo"
          width={1000}
          height={1000}
          quality={100}
        />
      )}
      <div className="flex items-start justify-center flex-col py-1">
        <div className="text-xm">{props.name}</div>
        <div className="text-xl">{props.last_message}</div>
      </div>
    </div>
  );
}
