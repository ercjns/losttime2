import { RenderStyleWrapper } from "./RenderStyleWrapper";
import { RenderStyles } from "./RenderStyles";

export class Standard_Txt extends RenderStyleWrapper {

    styleEnumValue = RenderStyles.standard_txt;
    extension = "txt";

    render(): string {
        let doc = "";
        this.data.forEach((c) =>
            doc += c.render(this.styleEnumValue));
        return doc
    }
}