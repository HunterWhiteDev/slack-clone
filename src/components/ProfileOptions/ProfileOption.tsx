interface ProfileOptionsProps {
  title: string;
  Icon: any;
  onClick: any;
}

function ProfileOption(props: ProfileOptionsProps) {
  const { title, Icon, onClick } = props;

  return (
    <div className="profileOption" onClick={onClick}>
      <Icon className="profileOption__icon" /> {title}
    </div>
  );
}

export default ProfileOption;
