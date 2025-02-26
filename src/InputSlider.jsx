import { Input, Slider } from "@mui/material";

export const InputSlider = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <Slider
        value={props.value}
        step={0.01}
        min={-2}
        max={2}
        onChange={props.onChange}
        sx={{marginLeft: '3rem'}}
      />
      {props.value}
    </div>
  )
}

export default InputSlider
