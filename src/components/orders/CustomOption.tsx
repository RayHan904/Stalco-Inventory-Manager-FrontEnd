import { components } from 'react-select';

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      {(props.data.value !== 'select-all' && props.data.value !== 'null') && (
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginRight: 10 }}
        />
      )}
      {props.data.label}
    </components.Option>
  );
};

export default CustomOption;
