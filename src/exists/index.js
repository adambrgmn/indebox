import { finder } from '../system';

export default function exists(posix) {
  return finder.exists(Path(posix));
}
