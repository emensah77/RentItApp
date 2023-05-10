export default class SafeInsetHelper {
  static getSafeBottomInset = ({insets, minimumValue}) => Math.max(insets.bottom, minimumValue);
}
