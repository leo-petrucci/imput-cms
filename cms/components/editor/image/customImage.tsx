import { useNodeCtx } from "@milkdown/react";
import Box from "cms/components/designSystem/box";
import Flex from "cms/components/designSystem/flex";
import { useEditor } from "cms/contexts/editorContext/useEditor";
import { useImages } from "cms/contexts/imageContext/useImageContext";
import { Upload } from "phosphor-react";
import React from "react";
import { styled } from "stitches.config";

const ImageContainer = styled("div", {
  "background-color": "$gray-100",
  "& > img": {
    width: "100%",
  },
});

const IconButton = styled("button", {
  background: "$gray-200",
  color: "$gray-600",
  border: "none",
  cursor: "pointer",
  padding: "$2",
  borderRadius: "$md",
  display: "flex",
  alignItems: "center",
  gap: "$1",
  fontSize: "$xs",

  "&:hover": {
    background: "$gray-300",
  },
});

const CustomImage: React.FC = () => {
  const { node } = useNodeCtx();
  const editor = useEditor();

  const { images, addImage } = useImages();

  const loadedImage = images.find((i) => i.filename === node.attrs.src);
  const src = loadedImage ? loadedImage.blobUrl : "";

  /**
   * Images were supposed to be removed from state here but the state had trouble updating correctly.
   * It might be better not removing images from state at all, and simply only uploading images that are left in the final markdown.
   */
  // React.useEffect(() => {
  //   console.log("image component");
  //   console.log(images);
  //   return () => {
  //     removeImage(node.attrs.src);
  //   };
  // }, []);

  // need this to open the filepicker when clicking the button
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null);

  // what happens when the image is selected
  const doLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addImage(editor.current!.ctx, e.target.files[0]);
  };

  return (
    <ImageContainer>
      <img src={src} alt={node.attrs.alt} title={node.attrs.title} />
      <input
        ref={uploadInputRef}
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={doLoad}
      />
      <Box
        css={{
          padding: "$2",
        }}
      >
        <Flex gap="2">
          <IconButton
            onClick={() => {
              uploadInputRef.current?.click();
            }}
          >
            <Upload size={16} />
            Upload image
          </IconButton>
        </Flex>
      </Box>
    </ImageContainer>
  );
};

export default CustomImage;
