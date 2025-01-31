import { Input, Slider } from "@mui/material";

export const InputSlider = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '0.5rem',
      }}
    >
      <Slider
        value={props.value}
        step={0.01}
        min={-2}
        max={2}
        onChange={props.onChange}
        sx={{width: '75%'}}
      />
      <Input
        type='numeric'
        value={props.value}
        step={0.01}
        min={-2}
        max={2}
        onChange={props.onChange}
        sx={{color: 'white', width: '20%'}}
      />
    </div>
  )
}

export default InputSlider
