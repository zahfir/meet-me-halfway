import Address from "@/app/models/Address";
import { FC } from "react";

interface AddressSearchListItemContentProps {
  address: Address;
}

/**
 * AddressSearchListItemContent component displays the formatted address lines
 * or the display name of an address.
 *
 * @component
 * @param {AddressSearchListItemContentProps} props - The props for the component.
 * @param {Address} props.address - The address object containing the formatted address lines and display name.
 * @returns {JSX.Element} The rendered component displaying the address information.
 */
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
      <span>{lineTwo}</span>
    </div>
  );
};

export default AddressSearchListItemContent;
