interface StyleMap {
  key: string;
  styles: StyleGroup[];
}

interface StyleGroup {
  name: string;
  value: string;
}

export default StyleMap;