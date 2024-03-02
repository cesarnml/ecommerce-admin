type Props = {
  title: string;
  description: string;
};

export const Heading = ({ title, description }: Props) => {
  return (
    <div>
      <h2>{title}d</h2>
      <p>{description}</p>
    </div>
  );
};
