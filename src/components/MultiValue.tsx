import { components } from 'react-select';

const MultiValue = ({ index, getValue, ...props }: any) => {
  const maxToShow = 1;
  const overflow = getValue().length - maxToShow;

  return index < maxToShow ? (
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <components.MultiValue {...props}>
      <div style={{ padding: '0 6px' }}>
        {overflow > 0 ? `+ ${overflow} more` : '...'}
      </div>
    </components.MultiValue>
  ) : null;
};

export default MultiValue;
