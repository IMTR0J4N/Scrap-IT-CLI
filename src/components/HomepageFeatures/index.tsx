import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { FcNoIdea, FcEngineering, FcOk } from "react-icons/fc";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    Svg: FcNoIdea,
    description: (
      <>
        Scrap-IT was designed to be easily installed and used to performly scrap
        websites with lot of options
      </>
    ),
  },
  {
    title: "Lot of Options",
    Svg: FcEngineering,
    description: (
      <>
        Scrap-IT has been coded to provide numerous options so that each user
        can find the functionality they need
      </>
    ),
  },
  {
    title: "Active Development",
    Svg: FcOk,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
