import Address from "@/app/models/Address";
import { FC } from "react";

interface AddressSearchListItemContentProps {
  address: Address;
}

const AddressSearchListItemContent: FC<AddressSearchListItemContentProps> = ({
  address,
}) => {
  const lineOne = address.formattedAddressLineOne;
  const lineTwo = address.formattedAddressLineTwo;

  if (!lineOne || !lineTwo)
    return (
      <div className="text-truncate">
        <strong>{address.display_name}</strong>
      </div>
    );
  return (
    <div className="d-flex flex-column">
      <strong className="">{lineOne}</strong>
      <text className="text-">{lineTwo}</text>
    </div>
  );
};

export default AddressSearchListItemContent;
