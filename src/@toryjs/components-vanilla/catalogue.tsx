import { FormComponentCatalogue } from '@toryjs/form';

import { FormulaView } from './formula_view';
// import { RepeaterView } from './repeater_view';
import { TextView, RichTextView, ImageView, LinkView, LinkSelectorView } from './text_view';
// import { GridView } from './grid_view';
import { StackView } from './stack_view';
import { AuthItem } from './auth_item_view';
import { FlexView } from './flex_view';
import { DateView } from './date_view';
import { MaskedView } from './masked_view';

import { createComponent, Form } from '@toryjs/ui';
import { MarkdownComponent } from './markdown_view';
import { InputView } from './input_view';
// import { TextAreaView } from './textarea_view';
import { CheckboxView } from './checkbox_view';
import { RadioView } from './radio_view';
import { DropdownView } from './dropdown_view';
import { HtmlFormComponent } from './html_form_view';
import { ButtonView } from './buttons_view';
import { FetchView } from './fetch_view';
import { IfView } from './if_view';

export const catalogue: FormComponentCatalogue = {
  createComponent: createComponent,
  components: {
    AuthItem: AuthItem,
    Button: ButtonView,
    Checkbox: CheckboxView,
    Container: null as any,
    Date: DateView,
    Dropdown: DropdownView,
    EditorCell: null as any,
    Fetch: FetchView,
    Flex: FlexView,
    Form: Form,
    Formula: FormulaView,
    // Grid: GridView,
    HtmlForm: HtmlFormComponent,
    Image: ImageView,
    If: IfView,
    Input: InputView,
    Link: LinkView,
    LinkSelector: LinkSelectorView,
    MaskedInput: MaskedView,
    Markdown: MarkdownComponent,
    Radio: RadioView,
    // Repeater: RepeaterView,
    RichText: RichTextView,
    Stack: StackView,
    Text: TextView
    // Textarea: TextAreaView
  }
};
