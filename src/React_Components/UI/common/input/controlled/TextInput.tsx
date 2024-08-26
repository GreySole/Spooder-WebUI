interface TextInputProps {
  key?: string;
  value: string;
  label?: string;
  charLimit?: number;
  jsonFriendly?: boolean;
  onInput: (value: string) => void;
}

export default function TextInput(props: TextInputProps) {
  const { key, value, label, charLimit, jsonFriendly } = props;
  function _onInput(value: string) {
    if (charLimit !== undefined) {
      if (value.length > charLimit) {
        return value.substring(0, charLimit);
      }
    }
    if (jsonFriendly) {
      return value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, '').replace(' ', '_');
    }
    return value;
  }
  return (
    <label htmlFor={`text-${key}`}>
      {label}
      <input
        id={`text-${key}`}
        className='text-input'
        type='text'
        value={value}
        onChange={(e) => _onInput(e.target.value)}
      />
    </label>
  );
}
