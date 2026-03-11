import { RenderStyleWrapper } from "./RenderStyleWrapper";
import { RenderStyles } from "./RenderStyles";

export class Cascade_WinterAwards extends RenderStyleWrapper {

    styleEnumValue = RenderStyles.cascade_winterawards;
    extension = "txt";

    render(): string {
        let doc = "";
        this.data.forEach((c) =>
            doc += c.render(this.styleEnumValue));
        return doc
    }
}