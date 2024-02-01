function createContentWithLineBreaks(text: string): boolean[] {
    return text.split('\n').map((line, index, array) => (
        <span key={index}>
          {line}
          {index !== array.length - 1 && <br />}
        </span>
      ));
}

export default createContentWithLineBreaks;
