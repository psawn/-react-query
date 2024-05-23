export type TImage = {
  caption: string;
  path: string;
};

export default function ImagePicker({
  images,
  selectedImage,
  onSelect,
}: {
  images: TImage[];
  selectedImage: string | undefined;
  onSelect: (image: string) => void;
}) {
  return (
    <div id="image-picker">
      <p>Select an image</p>
      <ul>
        {images.map((image) => (
          <li
            key={image.path}
            onClick={() => onSelect(image.path)}
            className={selectedImage === image.path ? "selected" : undefined}
          >
            <img
              src={`http://localhost:3000/${image.path}`}
              alt={image.caption}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
