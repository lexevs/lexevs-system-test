cd /lexevs/admin

chmod 777 *

./LoadLgXML.sh -in ../test/resources/testData/Automobiles.xml -a -t "PRODUCTION"

./LoadLgXML.sh -in ../test/resources/testData/German_Made_Parts.xml -a  -t "PRODUCTION"

./LoadLgXML.sh -in ../test/resources/testData/Automobiles2.xml

./LoadLgXML.sh -in ../test/resources/testData/BoostedQuery.xml -a

./LoadOWL2.sh -in ../test/resources/testData/camera.owl -a

./LoadOWL2.sh -in ../test/resources/testData/owl2/owl2-special-cases-Defined-Annotated.owl -a

./LoadOBO.sh -in ../test/resources/testData/cell.obo -a

./LoadOBO.sh -in ../test/resources/testData/fungal_anatomy.obo -a

./LoadLgXML.sh -in ../test/resources/testData/testMapping.xml -a

./LoadLgXML.sh -in ../test/resources/testData/testExtension.xml -a

./LoadLgXML.sh -in ../test/resources/testData/valueDomain/pickListTestData.xml

./LoadLgXML.sh -in ../test/resources/testData/valueDomain/vdTestData.xml

./LoadLgXML.sh -in ../test/resources/testData/valueDomain/VDForOneChild.xml

./LoadResolvedValueSetDefinition.sh -u "SRITEST:AUTO:AllDomesticButGM" -a

./LoadResolvedValueSetDefinition.sh -u "SRITEST:AUTO:AllDomesticButGMWithlt250charName" -a

./LoadResolvedValueSetDefinition.sh -u "XTEST:One.Node.ValueSet" -a

./LoadLgXML.sh -in ../test/resources/testData/valueDomain/VSD_OWL2Annotations.xml -a

./SupplementScheme.sh -r -parentUri "urn:oid:11.11.0.1" -parentVersion "1.0" -supplementUri "urn:oid:11.11.0.1.1-extension" -supplementVersion "1.0-extension"
