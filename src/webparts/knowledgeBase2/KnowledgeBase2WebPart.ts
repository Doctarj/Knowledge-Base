import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "KnowledgeBase2WebPartStrings";
import KnowledgeBase from "./components/KnowledgeBase2";
import { IKnowledgeBaseProps } from "./components/IKnowledgeBaseProps";

export interface IKnowledgeBase2WebPartProps {
  description: string;
}

export default class KnowledgeBase2WebPart extends BaseClientSideWebPart<IKnowledgeBase2WebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    try {
      const element: React.ReactElement<IKnowledgeBaseProps> = React.createElement(
        KnowledgeBase,
        {
          description: this.properties.description,
          isDarkTheme: this._isDarkTheme,
          environmentMessage: this._environmentMessage,
          userDisplayName: this.context.pageContext.user.displayName
        }
      );

      ReactDom.render(element, this.domElement);
    } catch (err) {
      var message = err instanceof Error ? err.message : String(err);
      var stack = err instanceof Error ? err.stack : "";
      this.domElement.innerHTML =
        "<div style=\"padding:20px;background:#fee;border:2px solid red;font-family:monospace;white-space:pre-wrap;\">" +
        "<h3>RENDER ERROR:</h3><p>" + message + "</p><pre>" + stack + "</pre></div>";
    }
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    return Promise.resolve();
  }

  private _getEnvironmentMessage(): string {
    return strings.AppLocalEnvironmentSharePoint || "Running in SharePoint";
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
    this._isDarkTheme = !!currentTheme.isInverted;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}