import { formatPhoneLocal, parsePhoneLocal, PHONE_PREFIX } from '../utils/phone';

function PhoneInput({ value, onChange, placeholder = '90 123 45 67', required = false, id }) {
  function handleChange(e) {
    onChange(formatPhoneLocal(e.target.value));
  }

  return (
    <div className="phone-input-wrap">
      <span className="phone-prefix">{PHONE_PREFIX}</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        maxLength={13}
      />
    </div>
  );
}

export { parsePhoneLocal, formatPhoneLocal, PHONE_PREFIX };
export default PhoneInput;
