import * as LabelPrimitive from "@radix-ui/react-label";
import { styled } from "stitches.config";

const StyledLabel = styled(LabelPrimitive.Root, {
  color: "$gray-800",
  textTransform: "capitalize",
  fontWeight: "$medium"
});

const Label = (props: LabelPrimitive.LabelProps) => {
  return <StyledLabel {...props} />;
};

export default Label;
