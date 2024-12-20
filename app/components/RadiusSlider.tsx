import React from "react";

interface RadiusSliderProps {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

/**
 * RadiusSlider component allows users to select a radius value within a specified range.
 * It updates the meeting area radius and refreshes points of interest (POIs) on the map.
 *
 * @component
 * @param {number} min - The minimum value for the slider.
 * @param {number} max - The maximum value for the slider.
 * @param {number} step - The step value for the slider.
 * @param {number} defaultValue - The default value for the slider.
 *
 * @example
 * <RadiusSlider min={1} max={100} step={1} defaultValue={50} />
 */
import "bootstrap/dist/css/bootstrap.min.css";
import useMapStore from "../state/useMapStore";

const RadiusSlider: React.FC<RadiusSliderProps> = ({
  min,
  max,
  step,
  defaultValue,
}) => {
  const { clearPOIs, refreshPOIs } = useMapStore();
  const selectedPOI = useMapStore((state) => state.selectedPOI);
  const sliderValue = useMapStore(
    (state) => state.meetingArea?.radius ?? defaultValue
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = Number(event.target.value);
    const meeting = useMapStore.getState().meetingArea;
    if (!meeting) return;

    // STATE
    meeting.radius = updatedValue;
    useMapStore.setState({ meetingArea: meeting });
    selectedPOI?.handleMarkerClick();
    clearPOIs(meeting);
    refreshPOIs(meeting);

    // UI
    meeting.updateCircle();
  };

  return (
    <div className="pt-3">
      <label htmlFor="radius-slider" className="form-label text-light">
        Radius: {sliderValue} km
      </label>
      <input
        type="range"
        className="form-range"
        id="radius-slider"
        value={sliderValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
};

export default RadiusSlider;
